import pytest


@pytest.fixture(autouse=True)
def enable_runtime_checks(direct_vm):
    direct_vm.check_pickling = True
