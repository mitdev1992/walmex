'use strict';
const _ = require('lodash');
const db = require('./db.js');


// UTILS
//----------------
// This is a mock db call that waits for # milliseconds and returns
const mockDBCall = (dataAccessMethod) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(dataAccessMethod());
        }, 500);
    });
};

// MOCK DB CALLS
//----------------
const getUsers = () => {
    try {
        const dataAccessMethod = () => _.map(db.usersById, userInfo => userInfo)
        return mockDBCall(dataAccessMethod);
    } catch (error) {
        return 'Unbale to propcess you request at this moment. Please try later.' + error;
    }
};

// Function to get list of items
const getItems = () => { 
    try {
        // Getting the list of unique items from all users items
        const dataAccessMethod = () => _.uniq(_.flatten(_.values(db.itemsOfUserByUsername, item => item)))
        return mockDBCall(dataAccessMethod);
    } catch (error) {
        return 'Unbale to propcess you request at this moment. Please try later.' + error;
    }
}

// function to get age and counts for user's repective item. Improved adding try catch in case there is an error during database operation
const getListOfAgesOfUsersWith = (item) => {
    try {
        const dataAccessMethod = () => {
            // getting the list of users against matched item
            const matchedUsers = _.keys(_.pickBy(db.itemsOfUserByUsername, function(value, key) {
                if (_.includes(value, item)) {
                    return key;
                }
              }));
              
            // getting final list of age and count for the respective users matched from previous operation
            return _.reduce(_.countBy(_.map(matchedUsers, data => _.find(db.usersById, userInfo => {if (userInfo.username === data) { return userInfo}})), 'age'), function(result, value, key) {
                result.push({"age": key, "count": value});
                return result;
            }, []);
        }
        return mockDBCall(dataAccessMethod); 
    } catch (error) {
        return 'Unbale to propcess you request at this moment. Please try later.' + error;
    }
}

module.exports = {
    getUsers,
    getListOfAgesOfUsersWith,
    getItems
};
