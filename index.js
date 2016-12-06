// TODO: Move the audio into the public alexa folder

var questions = [
	{"question": "Who parted the red sea?", "answer": "Moses"},
	{"question": "How many days did it take for God to create the earth?", "answer": "7"}
];

var alexa = require('alexa-app');

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;


// Define an alexa-app
var app = new alexa.app('bible_trivia_question');
app.launch(function(req,res) {
	launch(req,res);
});

var launch = function(req,res){
	res.say(getQuestion(req,res)).reprompt('<audio src="https://home.laprell.org/audio/buzzer3.mp3" />').shouldEndSession(false);
};

app.intent("AMAZON.RepeatIntent", function(req, res){
	launch(req,res);
});

var lastQuestion;
var lastQuestionAnswer;

app.intent('AnswerIntent', {
		"slots":{"ANSWER":"LIST_OF_ANSWERS"},
		"utterances":["{moses|seven|ANSWER}"]
	},function(req,res) {
		console.log('SCORE: Your answer is ' + req.slot('ANSWER'));
		console.log("The question was " + lastQuestion);
		console.log("The answer is " + lastQuestionAnswer);
		
		if(req.slot('ANSWER') == lastQuestionAnswer){
			reset();
			res.say('<audio src="https://home.laprell.org/audio/mario-victory.mp3" />');
		} else {
			reset();
			res.say('<audio src="https://home.laprell.org/audio/buzzer3.mp3" />');
		}
		
	}
);

var getQuestion = function(req,res){
	//if(req.session('lastQuestion')){
	if(lastQuestion){
		return lastQuestion;	
	} else {
		var question = pickRandomQuestion();
		lastQuestion = question.question;
		lastQuestionAnswer = question.answer;
		return question.question;	
	}
};

var pickRandomQuestion = function(){
	var randomNumber = Math.floor(Math.random() * questions.length);
	return questions[randomNumber];
};

app.error = function(exception, request, response) {
    console.log(exception);
    throw exception;
};

var reset = (function(req,res) {
    lastQuestion = null;
    lastQuestionAnswer = null;
});

module.exports = app;
