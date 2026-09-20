# v0.3.0
# { "Depends": "py-genlayer:5jycge4q8k23462jtb0b9fyey1s9qz928sz2nbrd9mg4sxqg2qng" }

"""Local-only probe for the installed GenVM web Response shape.

This is not product logic and is never a deployment candidate. It makes the
documented ``status_code`` versus installed-runtime ``status`` difference
reproducible through the same Direct Mode harness used by the contract tests.
"""

import json
import typing

import genlayer as gl


def _shape(url: str) -> str:
    response = gl.nondet.web.get(url)
    return json.dumps(
        {
            "has_status": hasattr(response, "status"),
            "has_status_code": hasattr(response, "status_code"),
            "status": getattr(response, "status", None),
        },
        sort_keys=True,
        separators=(",", ":"),
    )


class ContractProbe(gl.contract.Contract):
    def __init__(self):
        pass

    @gl.public.write
    def inspect_response(self, url: str) -> str:
        def leader_fn() -> str:
            return _shape(url)

        def validator_fn(leader_result: typing.Any) -> bool:
            if not isinstance(leader_result, gl.vm.Return):
                return False
            return leader_result.calldata == _shape(url)

        result = gl.vm.run_nondet(leader_fn, validator_fn)
        if isinstance(result, gl.vm.Return):
            return result.calldata
        if isinstance(result, str):
            return result
        else:
            raise gl.vm.UserError("Probe did not return a value")
