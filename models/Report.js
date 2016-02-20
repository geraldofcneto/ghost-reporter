'use strict';

module.exports = function (sequelize, Sequelize) {
    return sequelize.define('Report', {
        template: Sequelize.STRING,
        data: Sequelize.STRING
    }, {
        classMethods: {
            associate: function (models) { }
        }
    });
}