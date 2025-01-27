export default function Start() {
	return (
		<main>
			<div>
				<h1 className="text-center p-2 text-xl bold">
					Collaborative presentation Software
				</h1>
			</div>
			<div className="flex">
				<button className="px-2 py-1 border-2 border-solid border-black rounded ml-auto mr-10">
					Create room
				</button>
			</div>
			<div>
				<ul className="ml-10">
					Active Rooms
					<li>1 la primera</li>
					<li>2 la segunda</li>
				</ul>
			</div>
		</main>
	);
}
