<script>
	import '../global.css';

	let number = 0;
	let gameEnded = false;
	let isCounting = false;
	let touchCount = 0;

	let players = [];
	let playerID = 0;

	let intervalID;

	function startIncreasing(e) {
		touchCount++;
		if (isCounting) {
			return;
		}

		isCounting = true;
		intervalID = setInterval(() => number++, 100);
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
		<div class="counter">
			{number}
		</div>

		<button
			class="increase-button"
			on:pointerdown|preventDefault|nonpassive={startIncreasing}
			on:pointerleave|preventDefault|nonpassive={stopIncreasing}
			on:touchmove|preventDefault|nonpassive|stopPropagation={(e) => {}}
		/>

		<button class="game-button end-game-button" on:click={endGame}>게임 끝내기</button>
	{/if}

	{#if gameEnded}
		<button class="game-button restart-button" on:click={restart}>게임 다시하기</button>
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
		user-select: none;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100dvh;
	}

	.counter {
		width: 10rem;
		background-color: azure;
		font-family: 'Sometype Mono', monospace;
		font-size: 40px;
		text-align: right;
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
		border: 0px;
		font-size: 1rem;
	}
	.end-game-button {
		background-color: bisque;
	}
	.restart-button {
		background-color: chartreuse;
	}
</style>
