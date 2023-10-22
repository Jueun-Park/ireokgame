<script>
	import '../global.css';

	let number = 0;
	let gameEnded = false;
	let isCounting = false;

	let players = [];
	let playerID = 0;

	let intervalID;

	function startIncreasing() {
		isCounting = true;
		intervalID = setInterval(increaseNumber, 100);
	}

	function stopIncreasing() {
		if (!isCounting) {
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
	}

	function increaseNumber() {
		number++;
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
		<div class="counter">
			{number}
		</div>

		<button
			id="increase-button"
			on:mousedown={startIncreasing}
			on:mouseup={stopIncreasing}
			on:mouseleave={stopIncreasing}
		>
			누르고 있으세요
		</button>

		<button id="endGameButton" on:click={endGame}>게임 끝내기</button>
	{/if}

	{#if gameEnded}
		<button id="restart" on:click={restart}>게임 다시하기</button>
	{/if}

	<div>
		players:
		{#each players as player}
			{player.id},
		{/each}
	</div>
</div>

<style>
	.game-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100dvh;
	}

	.counter {
		width: 10rem;
		background-color: azure;
		font-family: monospace;
		font-size: 40px;
		text-align: right;
	}

	button#increase-button {
		margin: 1rem;
		background-color: beige;
		width: auto;
		height: 4rem;
	}
</style>
