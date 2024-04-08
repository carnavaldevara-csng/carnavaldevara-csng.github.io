export class TraseuUtilities
{
	static traseuLUT = {
		1: {
			name: "Când Grecia visează",
			probe: {
				stiinte: "Cărțile lui Herodot",
				sport: "Medalia lui Alexandru",
				arta: "Mătasea lui Virgiliu"
			}
		},
		2: {
			name: "Floarea darurilor",
			probe: {
				stiinte: "Cartea lui Marco Polo",
				sport: "Elefantul lui Carol cel Mare",
				arta: "Cântecul lui Roland"
			}
		},
		3: {
			name: "Într-un sipet fermecat",
			probe: {
				stiinte: "Lampa lui Aladin",
				sport: "Aventurile lui Simbod Marinarul",
				arta: "Nopțile Șeherezadei"
			}
		}
	};


	static TraseuNameFromNumber(num)
	{
		return TraseuUtilities.traseuLUT[num].name;
	}

	static ProbaNameFromTraseu(traseuNum, probaKey)
	{
		return TraseuUtilities.traseuLUT[traseuNum].probe[probaKey];
	}
}