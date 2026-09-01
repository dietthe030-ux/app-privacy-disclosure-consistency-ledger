import json


STORE_URL = "https://store.example/app-1"
POLICY_URL = "https://publisher.example/privacy"


def _mock_assessment(direct_vm, store, policy, store_body="store", policy_body="policy"):
    direct_vm.mock_web(r"store\.example/app-1", {"status": 200, "body": store_body})
    direct_vm.mock_web(r"publisher\.example/privacy", {"status": 200, "body": policy_body})
    direct_vm.mock_llm(
        r"Compare the two app privacy disclosures",
        json.dumps({"store": store, "policy": policy}),
    )


def _side(collection="PERMITTED", sharing="NOT_MENTIONED", deletion="PERMITTED", kind="DAYS", days=30):
    return {
        "collection": collection,
        "sharing": sharing,
        "deletion": deletion,
        "retention_kind": kind,
        "retention_days": days,
    }


def test_state_machine_and_append_only_reassessment(direct_vm, direct_deploy, direct_alice, direct_bob):
    contract = direct_deploy("contracts/app_privacy_disclosure_consistency_ledger.py")
    direct_vm.sender = direct_alice
    contract.create("app-1", "com.example.app", STORE_URL, POLICY_URL, "android")

    with direct_vm.expect_revert("Record must be frozen"):
        contract.assess("app-1")

    with direct_vm.prank(direct_bob):
        with direct_vm.expect_revert("Only the record owner can freeze it"):
            contract.freeze("app-1")
    contract.freeze("app-1")

    _mock_assessment(direct_vm, _side(), _side())
    assert contract.assess("app-1") == "CONSISTENT"
    assert direct_vm.run_validator() is True
    first = json.loads(contract.get_assessment("app-1", 1))
    assert first["verdict"] == "CONSISTENT"

    direct_vm.clear_mocks()
    _mock_assessment(direct_vm, _side(), _side(sharing="PERMITTED"))
    assert contract.reassess("app-1") == "DISCLOSURE_MISSING"
    assert direct_vm.run_validator() is True
    assert json.loads(contract.get_assessment("app-1", 1))["verdict"] == "CONSISTENT"
    assert json.loads(contract.get_assessment("app-1", 2))["verdict"] == "DISCLOSURE_MISSING"
    assert json.loads(contract.get("app-1"))["revision"] == 2


def test_conflict_and_unavailable_sources_fail_safe(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/app_privacy_disclosure_consistency_ledger.py")
    direct_vm.sender = direct_alice
    contract.create("app-1", "com.example.app", STORE_URL, POLICY_URL, "ios")
    contract.freeze("app-1")

    _mock_assessment(direct_vm, _side(), _side(collection="RESTRICTED"))
    assert contract.assess("app-1") == "MATERIAL_CONFLICT"
    assert direct_vm.run_validator() is True
    direct_vm.clear_mocks()

    direct_vm.mock_web(r"store\.example/app-1", {"status": 503, "body": "down"})
    direct_vm.mock_web(r"publisher\.example/privacy", {"status": 200, "body": "policy"})
    direct_vm.mock_llm(
        r"Compare the two app privacy disclosures",
        json.dumps({"store": _side(), "policy": _side()}),
    )
    assert contract.reassess("app-1") == "UNRESOLVED"
    assert direct_vm.run_validator() is True
    assert json.loads(contract.get("app-1"))["revision"] == 2


def test_invalid_source_and_duplicate_id_rejected(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/app_privacy_disclosure_consistency_ledger.py")
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("Sources must be public HTTPS URLs"):
        contract.create("bad", "com.example.app", "http://store.example/app", POLICY_URL, "android")
    contract.create("app-1", "com.example.app", STORE_URL, POLICY_URL, "android")
    with direct_vm.expect_revert("Record already exists"):
        contract.create("app-1", "com.example.app", STORE_URL, POLICY_URL, "android")
