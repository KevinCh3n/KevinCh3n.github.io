// Background scrolling speed
let move_speed = 2.5;

const windowHeight = window.innerHeight;

const fallFactor = windowHeight * .00003;

// Getting reference to the bird element
let bat = document.querySelector('.bat');

// Getting bird element properties
let bird_props = bat.getBoundingClientRect();
let background =
	document.querySelector('.background')
		.getBoundingClientRect();

// Getting reference to the score element
let score_val =
	document.querySelector('.score_val');
let message =
	document.querySelector('.message');
let score_title =
	document.querySelector('.score_title');

// Setting initial game state to start
const GamesStates = {
	Start: Symbol("Start"),
	Play: Symbol("Play"),
	End: Symbol("End")
}
let curr_game_state = GamesStates.Start;


let backgroundContainer = document.querySelector('.background');

// Add an eventlistener for key presses
document.addEventListener('keydown', (e) => {

	// Start the game if enter key is pressed
	if (e.key == ' ' &&
		curr_game_state != GamesStates.Play) {
		document.querySelectorAll('.pipe_sprite')
			.forEach((e) => {
				e.remove();
			});
		bat.style.top = '40vh';
		curr_game_state = GamesStates.Play;
		message.innerHTML = '';
		score_title.innerHTML = 'Score : ';
		score_val.innerHTML = '0';
		backgroundContainer.style.animationPlayState = 'running';
		play();
	}
});


// Constant value for the gap between two pipes


function play() {
	
	function move() {

		// Detect if game has ended
		if (curr_game_state != GamesStates.Play) return

		// Getting reference to all the pipe elements
		let pipe_sprite = document.querySelectorAll('.pipe_sprite');
		pipe_sprite.forEach((element) => {

			let pipe_sprite_props = element.getBoundingClientRect();
			bird_props = bat.getBoundingClientRect();

			// Delete the pipes if they have moved out
			// of the screen hence saving memory
			if (pipe_sprite_props.right <= 0) {
				element.remove();
			} else {
				// Collision detection with bird and pipes
				if (
					bird_props.left < pipe_sprite_props.left +
					pipe_sprite_props.width &&
					bird_props.left +
					bird_props.width > pipe_sprite_props.left &&
					bird_props.top < pipe_sprite_props.top +
					pipe_sprite_props.height &&
					bird_props.top +
					bird_props.height > pipe_sprite_props.top
				) {

					// Change game state and end the game
					// if collision occurs
					curr_game_state = GamesStates.End;
					message.innerHTML = 'Press Space To Restart';
					message.style.left = '28vw';
					backgroundContainer.style.animationPlayState = 'paused';
					return;
				} else {
					// Increase the score if player
					// has the successfully dodged the
					if (
						pipe_sprite_props.right < bird_props.left &&
						pipe_sprite_props.right +
						move_speed >= bird_props.left &&
						element.increase_score == '1'
					) {
						score_val.innerHTML = +score_val.innerHTML + 1;
					}
					element.style.left =
						pipe_sprite_props.left - move_speed + 'px';
				}
			}
		})
		requestAnimationFrame(move);
	};
	requestAnimationFrame(move);

	
	let bird_dy = 0;	
	function apply_gravity() {
		if (curr_game_state != GamesStates.Play) return;
		bird_dy = bird_dy + fallFactor;
		document.addEventListener('keydown', (e) => {
			if (e.key == 'ArrowUp' || e.key == ' ') {
				bird_dy = -3.0;
			}
		});

		// Collision detection with bird and
		// window top and bottom
		bird_props = bat.getBoundingClientRect();

		if (bird_props.top <= 0 ||
			bird_props.bottom >= background.bottom) {
			curr_game_state = GamesStates.End;
			message.innerHTML = 'Press Space To Restart';
			message.style.left = '28vw';
			backgroundContainer.style.animationPlayState = 'paused';
			return;
		}
		bird_props = bat.getBoundingClientRect();
		bat.style.top = bird_props.top + bird_dy + 'px';
		requestAnimationFrame(apply_gravity);
	}
	requestAnimationFrame(apply_gravity);

	let pipe_seperation = 0;


	let pipe_gap = 35;
	function create_pipe() {
		console.log("in create_pipe: ", GamesStates.Play);
		if (curr_game_state != GamesStates.Play) return;

		
		// Create another set of pipes
		// if distance between two pipe has exceeded
		// a predefined value
		if (pipe_seperation > 230) {
			pipe_seperation = 0

			// Calculate random position of pipes on y axiss
			let pipe_posi = Math.floor(Math.random() * 43) + 8;
			let pipe_sprite_inv = document.createElement('div');
			pipe_sprite_inv.className = 'pipe_sprite';
			pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
			pipe_sprite_inv.style.left = '100vw';

			// Append the created pipe element in DOM
			document.body.appendChild(pipe_sprite_inv);
			let pipe_sprite = document.createElement('div');
			pipe_sprite.className = 'pipe_sprite';
			pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
			pipe_sprite.style.left = '100vw';
			pipe_sprite.increase_score = '1';

			// Append the created pipe element in DOM
			console.log("appending pipe to document");
			document.body.appendChild(pipe_sprite);
		}
		pipe_seperation++;
		requestAnimationFrame(create_pipe);
	}

	requestAnimationFrame(create_pipe);
}
