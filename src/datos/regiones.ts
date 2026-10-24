export type Region = {
    id: string;
    nombre: string;
    comunas: string[];
};

export const regionesChile: Region[] = [
    {
        id: "valparaiso",
        nombre: "Región de Valparaíso",
        comunas: [
            "Viña del Mar",
            "Valparaíso",
            "Quilpué",
            "Villa Alemana",
            "Concón",
            "Quillota",
            "San Antonio",
            "Los Andes",
            "San Felipe",
            "La Ligua",
            "Limache",
            "Olmué",
            "Quintero",
            "Puchuncaví"
        ]
    },
    {
        id: "rm",
        nombre: "Región Metropolitana",
        comunas: [
            "Santiago",
            "Providencia",
            "Las Condes",
            "Puente Alto",
            "Maipú",
            "Ñuñoa",
            "La Florida",
            "San Bernardo",
            "Pudahuel",
            "Quilicura",
            "Vitacura",
            "Lo Barnechea",
            "Peñalolén",
            "La Reina",
            "Macul",
            "Recoleta",
            "Independencia",
            "Estación Central"
        ]
    },
    {
        id: "biobio",
        nombre: "Región del Biobío",
        comunas: [
            "Concepción",
            "Talcahuano",
            "San Pedro de la Paz",
            "Los Ángeles",
            "Chiguayante",
            "Coronel",
            "Lota",
            "Penco",
            "Tomé",
            "Hualpén",
            "Cabrero",
            "Mulchén"
        ]
    }
];