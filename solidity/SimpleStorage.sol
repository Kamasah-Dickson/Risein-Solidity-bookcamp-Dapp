// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

contract SimpleStorage {
    uint256 favoriteNumber;
    mapping(string => uint256) public nameTofavoriteNumber;

    ///struct can also be used as a type

    struct People {
        uint256 favoriteNumber;
        string name;
    }

    People[] public people;

    function addPeople(string memory _name, uint256 _favoriteNumber) public {
        people.push(People(_favoriteNumber, _name));
        nameTofavoriteNumber[_name] = _favoriteNumber;
    }

    function store(uint256 _favoriteNumber) public virtual {
        favoriteNumber = _favoriteNumber;
    }

    function retrieve() public view returns (uint256) {
        return favoriteNumber;
    }
}
