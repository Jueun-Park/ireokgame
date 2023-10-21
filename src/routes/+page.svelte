<script>
	let number = 0;
	let gameEnded = false;

	let players = [];
	let playerID = 0;

	let intervalID;

	function startIncreasing() {
		intervalID = setInterval(increaseNumber, 100);
	}

	function stopIncreasing() {
		clearInterval(intervalID);
		let player = {
			number: number,
			id: playerID
		};
		players = [...players, player];
		playerID++;
		number = 0;
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

<button id="increaseButton" on:mousedown={startIncreasing} on:mouseup={stopIncreasing}>
	누르고 있으세요
</button>

{#if !gameEnded}
	<button id="endGameButton" on:click={endGame}>게임 끝내기</button>
{/if}

{#if gameEnded}
	<button id="restart" on:click={restart}>게임 다시하기</button>
{/if}

<div>
	{number}
</div>

<div>
	players:
	{#each players as player}
		{player.id},
	{/each}
</div>

{#if gameEnded}
	<div>
		{#each players as player}
			<div>player {player.id}: {player.number}<br /></div>
		{/each}
	</div>
{/if}
