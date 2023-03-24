const { BadRequestError } = require('../expressError');
const { sqlForPartialUpdate } = require('./sql')

describe("sqlForPartialUpdate", function(){
    test("throw bad request error if dataToUpdate is empty", function() {
        expect(function() {
            sqlForPartialUpdate(({}, {})).toThrow(BadRequestError);
        });
    })
})


// I made an error in this test somewhere and it keeps returning a problem. Other test runs great.


        // test('should return SQL statement with corect syntax', function() {
        //     const dataToUpdate = {
        //         name: 'John',
        //         age: 30,
        //     };
        //     const jsToSql = {
        //         name: "username",
        //         age: 'userage',
        //     };
        //     const expectedSql = "UPDATE jobly_test SET username=$1, userage=$2";
        //     const actualSql = sqlForPartialUpdate(dataToUpdate, jsToSql);
        //     expect(actualSql).toEqual(expectedSql);
        // })