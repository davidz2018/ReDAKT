var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define("user", {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          isAlpha: true,
          notEmpty: true,
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          isAlpha: true,
          notEmpty: true,
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
          isEmail: true,
          notEmpty: true,
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          notEmpty: true,
      }
    },
    income: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    creditCard: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    utilities: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rentMortgage: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    groceries: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    transportation: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    payOffDebt: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    activities: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    travel: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    buyHouse: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    investmentFunds: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  user.validPassword = function(password, hash, result, done){

    bcrypt.compare(password, hash, function(err, match){
      console.log('this is console log first thing in compare');
      if (err) {
        console.log('err: ' + err);
        return done(err);}
      if (match) {
        console.log('err: ' + match);
        return done(null, result);}
      else{
        console.log('else');
        return done(null, false);}
      console.log('this is console log lst thing in compare before promise');
    })
  }

  //BCRYPT HAVING ISSUE IMPLIMENTING -------------------------------

  user.hook('beforeCreate', (user, cb) => {
    //user is executing (3) times and errors everytime I create a new user
    bcrypt.hash(user.password, 10, function(err, res) {
      if(err) {
        return err;
      }else{
        user.password = res;

        user.save({fields: ['password']}).then(() => {});

      };
    });

  });

  //------------------------------------------------------------------


  // user.associate = function(models) {
  //     user.hasMany(models.Transaction, {
  //       onDelete: "cascade"
  //     })

  //   user.belongsTo(models.playerRating, {
  //     foreignKey: {
  //       allowNull: true
  //     }
  //   })
  // };

  return user;
};

