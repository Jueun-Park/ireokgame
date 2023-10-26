<script>
	import '../global.css';
	import { words } from '../lib/words';

	let ireok = 100000000;
	let logUnit = Math.log(ireok);

	const calculateFunctions = [
		(t) => Math.exp(logUnit * t),
		(t) => Math.pow(Math.pow(t, t), t),
		(t) => t
	];
	const calFuncMaxTimeRange = [
		{ e: 0.1, scale: 1.9 },
		{ e: 0.1, scale: 0.9 },
		{ e: 0.01, scale: 0.49 }
	];

	let number = 0;
	let isFreeze = false;

	let gameEnded = false;
	let isCounting = false;
	let touchCount = 0;
	let intervalID;

	let players = [];
	let playerID = 1;
	let nowNickname = getPlayerNickname();

	let losers = [];
	let winners = [];

	function startIncreasing(e) {
		touchCount++;
		if (isCounting) {
			return;
		}

		isCounting = true;

		let funcNum = Math.floor(Math.random() * calculateFunctions.length);
		let maxTime =
			Math.random() * calFuncMaxTimeRange[funcNum].scale + calFuncMaxTimeRange[funcNum].e;
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
		freezeGame();

		if (touchCount > 1) {
			touchCount--;
			return;
		}
		clearInterval(intervalID);
		let player = {
			number: number,
			id: playerID,
			nickname: nowNickname
		};
		players = [...players, player];
		isCounting = false;
		touchCount--;

		return;
	}

	function freezeGame() {
		isFreeze = true;
		setTimeout(() => {
			isFreeze = false;
			number = 0;
			playerID++;
			nowNickname = getPlayerNickname();
		}, 1000);
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
		playerID = 1;
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

	function getPlayerNickname() {
		let adjNum = Math.floor(Math.random() * words.adjectives.length);
		let nounNum = Math.floor(Math.random() * words.nouns.length);
		return words.adjectives[adjNum] + ' ' + words.nouns[nounNum];
	}
</script>

<body>
	<div class="game-container">
		<h1>일억게임</h1>

		{#if !gameEnded}
			{#if isFreeze}
				<h2>
					{playerID}번 <span class="nickname">{nowNickname}</span>의 숫자
				</h2>
			{:else}
				<h2>
					{playerID}번 <span class="nickname">{nowNickname}</span>의 차례
				</h2>
			{/if}
			<div
				class={isCounting
					? 'counter counter-counting'
					: isFreeze
					? 'counter counter-freeze'
					: 'counter counter-default'}
			>
				{number}
			</div>

			<button
				class={isFreeze ? 'increase-button-freeze' : 'increase-button'}
				on:pointerdown|preventDefault|nonpassive={isFreeze ? () => {} : startIncreasing}
				on:pointerleave|preventDefault|nonpassive={isFreeze ? () => {} : stopIncreasing}
				on:touchmove|preventDefault|nonpassive|stopPropagation={isFreeze ? () => {} : (e) => {}}
				on:contextmenu|preventDefault
			/>

			<button class="game-button end-game-button" on:click={endGame}>게임 끝내기</button>

			<div>
				고른 사람:
				{playerID - 1} 명
			</div>
		{/if}

		{#if gameEnded}
			<div>
				<div>
					<h2>걸린 사람:</h2>
					{#each losers as loser}
						<div>
							{loser.id}번 <span class="nickname">{loser.nickname}</span>: {loser.number}<br />
						</div>
					{/each}
				</div>
				<div>
					<h2>이긴 사람:</h2>
					{#each winners as winner}
						<div>
							{winner.id}번 <span class="nickname">{winner.nickname}</span>: {winner.number}<br />
						</div>
					{/each}
				</div>
			</div>

			<button class="game-button restart-button" on:click={restart}>게임 다시하기</button>
		{/if}
	</div>
</body>

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

	.counter-freeze {
		background-color: indianred;
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

	.increase-button-freeze {
		margin: 1rem;
		border: 0px;
		border-radius: 10rem;
		background-color: cadetblue;
		width: 8rem;
		height: 8rem;
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

	.nickname {
		text-decoration: underline dotted;
	}
</style>
