from pytest import fixture

from timecheck.app import OpeningHoursChecker


@fixture
def checker():
    return OpeningHoursChecker(8, 16)


def test_open(checker):
    assert checker.is_open(8)
    assert checker.is_open(15)


def test_closed(checker):
    assert not checker.is_open(7)
    assert not checker.is_open(16)


def test_open_overnight():
    chk = OpeningHoursChecker(18, 3)
    assert chk.is_open(18)
    assert chk.is_open(0)
    assert not chk.is_open(3)
    assert not chk.is_open(17)
