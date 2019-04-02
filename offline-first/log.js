const chalk = require('chalk');

const intro = () => {
    console.log(chalk.green('########################################################'));
    console.log(chalk.green('RXDB node example'));
    console.log(chalk.green('########################################################\n \n'));
};

const error = e => {
    console.log(chalk.red(e));
};

const logUser = user => {
    console.log(
        '#username: '+ user.username + '#pass' + user.password
    );
};

const Log = {
    intro: intro,
    error: error,
    logUser: logUser
};

module.exports = Log;