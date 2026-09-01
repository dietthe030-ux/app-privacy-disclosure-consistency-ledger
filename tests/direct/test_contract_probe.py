import json


def test_installed_runtime_response_shape(direct_vm, direct_deploy):
    contract = direct_deploy(".probe/contract_probe.py")
    direct_vm.mock_web(r"probe\.example/response", {"status": 200, "body": "ok"})

    observed = json.loads(contract.inspect_response("https://probe.example/response"))

    assert observed == {"has_status": True, "has_status_code": False, "status": 200}
    assert direct_vm.run_validator() is True
