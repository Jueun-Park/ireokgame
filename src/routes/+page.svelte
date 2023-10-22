<script>
	import '../global.css';

	let ireok = 100000000;
	let number = 0;
	let logUnit = Math.log(ireok);
	let gameEnded = false;
	let isCounting = false;
	let touchCount = 0;

	let players = [];
	let playerID = 0;

	let intervalID;

	let calculateFunctions = [(t) => Math.exp(logUnit * t), (t) => Math.pow(t, t)];

	function startIncreasing(e) {
		touchCount++;
		if (isCounting) {
			return;
		}

		isCounting = true;

		let maxTime = Math.random() * 1.9 + 0.1;
		let funcNum = Math.floor(Math.random() * calculateFunctions.length);
		let startTime = Date.now();
		intervalID = setInterval(() => {
			if (number < ireok) {
				let scaledTime = (Date.now() - startTime) / 1000 / maxTime;
				number = Math.floor(calculateFunctions[funcNum](scaledTime));
			} else {
				number = ireok;
			}
		}, 16);

		return;
	}

	function stopIncreasing(e) {
		if (!isCounting) {
			return;
		}
		if (touchCount > 1) {
			touchCount--;
			return;
		}
		clearInterval(intervalID);
		let player = {
			number: number,
			id: playerID
		};
		players = [...players, player];
		playerID++;
		number = 0;
		isCounting = false;
		touchCount--;
		return;
	}

	function endGame() {
		gameEnded = true;
	}

	function restart() {
		gameEnded = false;
		playerID = 0;
		players = [];
	}
</script>

<div class="game-container">
	<h1>일억게임</h1>

	{#if gameEnded}
		<div>
			{#each players as player}
				<div>player {player.id}: {player.number}<br /></div>
			{/each}
		</div>
	{/if}

	{#if !gameEnded}
		<div class={isCounting ? 'counter counter-counting' : 'counter counter-default'}>
			{number}
		</div>

		<button
			class="increase-button"
			on:pointerdown|preventDefault|nonpassive={startIncreasing}
			on:pointerleave|preventDefault|nonpassive={stopIncreasing}
			on:touchmove|preventDefault|nonpassive|stopPropagation={(e) => {}}
		/>

		<button class="game-button end-game-button" on:click={endGame}>게임 끝내기</button>

		<div>
			players:
			{#each players as player}
				{player.id},
			{/each}
		</div>
	{/if}

	{#if gameEnded}
		<button class="game-button restart-button" on:click={restart}>게임 다시하기</button>
	{/if}
</div>

<style>
	.game-container {
		user-select: none;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100dvh;
	}

	.counter {
		width: 16rem;
		font-family: 'Sometype Mono', monospace;
		font-size: 40px;
		text-align: right;
	}

	.counter-default {
		background-color: azure;
	}

	.counter-counting {
		background-color: cadetblue;
		color: whitesmoke;
	}

	.increase-button {
		margin: 1rem;
		border: 0px;
		border-radius: 10rem;
		background-color: indianred;
		width: 8rem;
		height: 8rem;
	}

	.increase-button:active {
		background-color: brown;
	}

	.game-button {
		margin: 2rem;
		border: 0px;
		font-size: 1rem;
	}
	.end-game-button {
		background-color: bisque;
	}
	.restart-button {
		background-color: palegreen;
	}
</style>
