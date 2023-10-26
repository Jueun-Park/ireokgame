<script>
	import '../global.css';

	let ireok = 100000000;
	let logUnit = Math.log(ireok);

	let calculateFunctions = [(t) => Math.exp(logUnit * t), (t) => Math.pow(t, t)];

	let number = 0;
	let gameEnded = false;
	let isCounting = false;
	let touchCount = 0;
	let intervalID;

	let players = [];
	let playerID = 0;

	let losers = [];
	let winners = [];

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
		const result = findLosersAndWinners(players);
		losers = result.losers;
		winners = result.winners;
	}

	function restart() {
		stopIncreasing();
		gameEnded = false;
		playerID = 0;
		players = [];
		losers = [];
		winners = [];
	}

	function findLosersAndWinners(players) {
		players.sort((a, b) => a.number - b.number);
		let ls = [];
		let ws = [];
		let ireokPlayers = [];

		for (const player of players) {
			if (player.number === ireok) {
				ireokPlayers.push(player);
			} else {
				if (ls.length === 0 || ls[0].number === player.number) {
					ls.push(player);
				} else if (ls.length === 1 && ls[0].number != player.number) {
					ws = [...ws, ...ls];
					ls = [player];
				} else {
					ws.push(player);
				}
			}
		}

		if (ireokPlayers.length > 1) {
			if (ireokPlayers.length === players.length) {
				ls = ireokPlayers;
				ws = [];
			} else {
				ws = [...ws, ...ireokPlayers];
			}
		} else if (ireokPlayers.length === 1) {
			ws = [...ws, ...ls];
			ls = ireokPlayers;
		}

		ls.sort((a, b) => a.id - b.id);
		ws.sort((a, b) => a.id - b.id);
		return { losers: ls, winners: ws };
	}
</script>

<body>
	<div class="game-container">
		<h1>일억게임</h1>

		{#if !gameEnded}
			<h2>
				{playerID}번 차례
			</h2>
			<div class={isCounting ? 'counter counter-counting' : 'counter counter-default'}>
				{number}
			</div>

			<button
				class="increase-button"
				on:pointerdown|preventDefault|nonpassive={startIncreasing}
				on:pointerleave|preventDefault|nonpassive={stopIncreasing}
				on:touchmove|preventDefault|nonpassive|stopPropagation={(e) => {}}
				on:contextmenu|preventDefault
			/>

			<button class="game-button end-game-button" on:click={endGame}>게임 끝내기</button>

			<div>
				고른 사람들:
				{#each players as player}
					{player.id},
				{/each}
			</div>
		{/if}

		{#if gameEnded}
			<div>
				<div>
					<h2>걸린 사람:</h2>
					{#each losers as loser}
						<div>사람 {loser.id}: {loser.number}<br /></div>
					{/each}
				</div>
				<div>
					<h2>이긴 사람:</h2>
					{#each winners as winner}
						<div>사람 {winner.id}: {winner.number}<br /></div>
					{/each}
				</div>
			</div>

			<button class="game-button restart-button" on:click={restart}>게임 다시하기</button>
		{/if}
	</div>
</body>

<style>
	body {
		font-family: 'Noto Sans KR', sans-serif;
		color: dimgray;
	}

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
		font-family: 'Noto Sans KR', sans-serif;
		color: dimgray;

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
