/**
 * This file is where you define your application routes and controllers.
 * 
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 * 
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 * 
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 * 
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 * 
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var _ = require('underscore');
var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// View Controller Routes
var connections = require('./views/connections');
var coverage = require('./views/coverage');

//var users = require('./api/user');
var ministryQuestions = require('./api/ministryquestion');
var ministryTeams = require('./api/ministryteam');
var communityGroups = require('./api/communitygroup');
var questionOptions = require('./api/ministryquestionoption');
var resources = require('./api/resource');
var resourceTags = require('./api/resourcetag');
var passengers = require('./api/passenger');
var rides = require('./api/ride');
var campuses = require('./api/campus');
var events = require('./api/event');
var users = require('./api/user');
var ministries = require('./api/ministry');
var summermissions = require('./api/summermission');
var notifications = require('./api/notification');

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	api: importRoutes('./api')
};

function addApiRoutes(app, name, route) {
	app.get('/api/' + name + '/list', keystone.middleware.api, route.list);
	app.get('/api/' + name + '/:id', keystone.middleware.api, route.get);
	app.all('/api/' + name + '/find', keystone.middleware.api, route.find);
	app.all('/api/' + name + '/search', keystone.middleware.api, route.search);
	app.all('/api/' + name + '/create', keystone.middleware.api, route.create); //TODO: take this out	
    app.all('/api/' + name + '/update', keystone.middleware.api, route.update);
    if (route.enumValues)
        app.get('/api/' + name + '/enumValues/:key', keystone.middleware.api, route.enumValues);
}

// Setup Route Bindings
exports = module.exports = function(app) {
	app.all('/api*', keystone.middleware.cors);
	// Views
	app.get('/', routes.views.index);
	// app.get('/blog/:category?', routes.views.blog);
	// app.get('/blog/post/:post', routes.views.post);
	// app.get('/gallery', routes.views.gallery);
	// app.all('/contact', routes.views.contact);
    app.get('/notifications', middleware.requireUser, routes.views.notifications);
    app.get('/notifications/renderScheduledNotifications', routes.views.notifications.renderScheduledNotifications);
    app.all('/notifications/renderEventNotifications', routes.views.notifications.renderEventNotifications);
    app.all('/notifications/renderEventNotificationTable', routes.views.notifications.renderEventNotificationTable);
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
	
	// API stuff
	app.post('/api/signin', routes.api.authUtils.signin);
	app.post('/api/signout', routes.api.authUtils.signout);

	
	// Site
	app.use('/connections', connections);
    app.use('/tests/coverage', coverage);
	
	// API
	app.use('/api/ministryquestions', ministryQuestions);
	app.use('/api/communitygroups', communityGroups);
	app.use('/api/ministryteams', ministryTeams)
	app.use('/api/ministryquestionoptions', questionOptions);
	app.use('/api/resources', resources);
	app.use('/api/resourcetags', resourceTags);
	app.use('/api/passengers', passengers);
	app.use('/api/rides', rides);
	app.use('/api/campuses', campuses);
	app.use('/api/events', events);
	app.use('/api/users', users);
	app.use('/api/ministries', ministries);
	app.use('/api/summermissions', summermissions);
	app.use('/api/notifications', notifications);
};
