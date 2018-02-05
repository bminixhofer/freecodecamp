//http://fantasynamegenerators.com/sword-names.php
var names = [
	"Shadowfang","Azurewrath","Assurance","ForgetMeNot","Red Obsidian","Abyssal Shard","Aetherius","Agatha","Alpha","Amnesia","Anduril",
	"Anger's Tear","Apocalypse","Armageddon","Arondite","Ashrune","Betrayal","Betrayer","Blackest Heart","Blackout","Blade of a Thousand Cuts",
	"Blade of the Grave","Blazefury","Blazeguard","Blight's Plight","Blind Justice","Blinkstrike","Bloodquench","Bloodweep","Broken Promise",
	"Brutality","Cataclysm","Catastrophe","Celeste","Chaos","Cometfell","Convergence","Corruption","Darkheart","Darkness","Dawn","Dawn of Ruins",
	"Dawnbreaker","Deathbringer","Deathraze","Decimation","Desolation","Despair","Destiny's Song","Devine","Devourer","Dirge","Divine Light",
	"Doomblade","Doombringer","Draughtbane","Due Diligence","Early Retirement","Echo","Piece Maker","Eclipse","Endbringer","Epilogue","Espada",
	"Eternal Harmony","Eternal Rest","Extinction","Faithkeeper","Fallen Champion","Fate","Final Achievement","Fleshrender","Florance","Frenzy",
	"Fury","Ghost Reaver","Ghostwalker","Gladius","Glimmer","Godslayer","Grasscutter","Grieving Blade","Gutrender","Hatred\'s Bite","Heartseeker",
	"Heartstriker","Hell's Scream","Hellfire","Hellreaver","Hollow Silence","Honor's Call","Hope's End","Infamy","Interrogator","Justice",
	"Justifier","King's Defender","King's Legacy","Kinslayer","Klinge","Knight's Fall","Knightfall","Lament","Last Rites","Last Words",
	"Lazarus","Life's Limit","Lifedrinker","Light's Bane","Lightbane","Lightbringer","Lightning","Limbo","Loyalty","Malice","Mangler",
	"Massacre","Mercy","Misery's End","Morbid Doom","Morbid Will","Mournblade","Narcoleptic","Needle","Nethersbane","Night's Edge",
	"Night's Fall","Nightbane","Nightcrackle","Nightfall","Nirvana","Oathbreaker","Oathkeeper","Oblivion","Omega","Orenmir","Peacekeeper",
	"Perfect Storm","Persuasion","Prick","Purifier","Rage","Ragespike","Ragnarok","Reaper","Reaper's Toll","Reckoning","Reign of Misery",
	"Remorse","Requiem","Requiem of the Lost","Retirement","Righteous Might","Rigormortis","Savagery","Scalpel","Scar","Seethe","Severance",
	"Shadow Strike","Shadowsteel","Silence","Silencer","Silver Saber","Silverlight","Skullcrusher","Slice of Life","Soul Reaper","Soulblade",
	"Soulrapier","Spada","Spike","Spineripper","Spiteblade","Stalker","Starshatterer","Sting","Stinger","Storm","Storm Breaker","Stormbringer",
	"Stormcaller","Storm-Weaver","Striker","Sun Strike","Suspension","Swan Song","The Ambassador","The Black Blade","The End","The Facelifter",
	"The Light","The Oculus","The Stake","The Untamed","The Unyielding","The Void","Thorn","Thunder","Toothpick","Tranquility","Treachery",
	"Trinity","Tyrhung","Unending Tyranny","Unholy Might","Valkyrie","Vanquisher","Vengeance","Venom","Venomshank","Warmonger","Widow Maker",
	"Willbreaker","Winterthorn","Wit's End","Witherbrand","Wolf","Worldbreaker","Worldslayer"];
module.exports = function() {
	return names[Math.floor(Math.random() * names.length)];
};
