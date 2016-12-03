// TODO: Move the audio into the public alexa folder


var questions = [
	{"question": "Who parted the red sea?", "answer": "moses"},
	{"question": "How many days did it take for God to create the earth?", "answer": "7"}
];

var intro = 'It\'s time for some bible trivia!  Are you ready? <audio src="https://home.laprell.org/sounds/air_horn.mp3" />';

var alexa = require('alexa-app');

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;

var lastQuestion = null;
var lastQuestionAnswer = null;

// Define an alexa-app
var app = new alexa.app('bible_trivia');
app.launch(function(req,res) {
	launch(res);
});

var launch = function(res){
	res.say(intro).reprompt(intro).shouldEndSession(false);
};

app.intent("AMAZON.YesIntent", function(req, res){
	res.say(getQuestion(res) + ' <audio src="http://192.168.0.35/air_horn.mp3" />').shouldEndSession(false);
});

app.intent("AMAZON.NoIntent", function(req, res){
	res.say("Okay. Good bye.");
});

app.intent('AnswerIntent', {
		"slots":{"ANSWER":"LIST_OF_ANSWERS"},
		"utterances":["{moses|seven|ANSWER}"]
	},function(req,res) {
		res.say('Your answer is ' + req.slot('ANSWER'));
		res.say("The question was " + req.session('lastQuestion'));
		res.say("The answer is " + req.session('lastQuestionAnswer'));
		if(req.slot('ANSWER') == req.session('lastQuestionAnswer')){
			res.say("You are right");
		} else {
			res.say("You are wrong");
		}
	}
);

var getQuestion = function(res){
	var question = pickRandomQuestion();
	res.session('lastQuestion', question.question);
	res.session('lastQuestionAnswer', question.answer);
	return question.answer;
};

var pickRandomQuestion = function(){
	var randomNumber = Math.floor(Math.random() * questions.length);
	return questions[randomNumber];
};

app.error = function(exception, request, response) {
    console.log(exception);
    throw exception;
};

module.exports = app;
