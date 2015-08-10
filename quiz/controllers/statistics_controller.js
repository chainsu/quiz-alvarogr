var models = require('../models/models.js');
var Sequelize = require('sequelize');

var statistics = {
      quizes: 0,
      comments: 0,
      commentsUnpublished: 0,
      commentedQuizes:0
    };

exports.obtenerEstadisticas = function(req, res, next) {
//Se ha usado el método all de Promises (implementado ya en sequelize), ya que
//de esta forma se ejecutan las consultas asíncronamente en paralelo y se
//continúa cuando han acabado todas.
    Sequelize.Promise.all([
        models.Quiz.count(),
        models.Comment.count(),
//Se ha añadido nuevos métodos al modelo Comment en models/comment.js
//Para ello se han seguido las instucciones de la documentación de sequelize:
//http://docs.sequelizejs.com/en/latest/docs/models-definition/#expansion-of-models
        models.Comment.countUnpublished(),
        models.Comment.countCommentedQuizes()
    ]).then( function( values ){
        statistics.quizes=values[0];
        statistics.comments=values[1];
        statistics.commentsUnpublished=values[2];
        statistics.commentedQuizes=values[3];
    }).catch( function (err) {
        next(err);
    }).finally( function() {
        next();
    });
};

// GET /quizes/statistics
exports.show = function(req, res) {
    res.render('quizes/statistics', {
        statistics: statistics,
        errors: []
    });
};
