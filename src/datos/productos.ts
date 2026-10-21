export type Producto = {
    id: number;
    codigo: string;
    categoria: string;
    nombre: string;
    marca: string;
    modelo: string;
    precio: number;
    stock: number;
    descripcion: string;
    imagen: string;
};

export const productos: Producto[] = [
    { id: 1, codigo: 'GA001', categoria: 'Guitarras Acústicas', nombre: 'Guitarra Acústica Folk', marca: 'Yamaha', modelo: 'F310', precio: 129990, stock: 8, descripcion: 'Tapa de abeto, aros y fondo de meranti. Ideal para iniciantes.', imagen: 'ga001.jpg' },
    { id: 2, codigo: 'GA002', categoria: 'Guitarras Acústicas', nombre: 'Guitarra Acústica Dreadnought', marca: 'Fender', modelo: 'CD-60S', precio: 189990, stock: 5, descripcion: 'Tapa de abeto macizo, brazo de caoba. Sonido cálido y proyectado.', imagen: 'ga002.webp' },
    { id: 3, codigo: 'GA003', categoria: 'Guitarras Acústicas', nombre: 'Guitarra Acústica Clásica 4/4', marca: 'Yamaha', modelo: 'C40', precio: 89990, stock: 10, descripcion: 'Nailon, tapa de abeto. Ideal para estudio y flamenco.', imagen: 'ga003.webp' },
    { id: 4, codigo: 'GA004', categoria: 'Guitarras Acústicas', nombre: 'Guitarra Electroacústica', marca: 'Takamine', modelo: 'GN20CE', precio: 349990, stock: 3, descripcion: 'Pickup integrado, afinador incorporado.', imagen: 'ga004.webp' },
    { id: 5, codigo: 'GA005', categoria: 'Guitarras Acústicas', nombre: 'Guitarra 3/4 Niños', marca: 'Yamaha', modelo: 'JR1', precio: 79990, stock: 6, descripcion: 'Tamaño reducido para niños de 6 a 10 años.', imagen: 'ga005.avif' },
    { id: 6, codigo: 'GE001', categoria: 'Guitarras Eléctricas', nombre: 'Guitarra Eléctrica Stratocaster', marca: 'Squier', modelo: 'Affinity Strat', precio: 249990, stock: 5, descripcion: 'Cuerpo de álamo, mástil de arce, pastillas SSS.', imagen: 'ge001.jpg' },
    { id: 7, codigo: 'GE002', categoria: 'Guitarras Eléctricas', nombre: 'Guitarra Eléctrica Les Paul', marca: 'Epiphone', modelo: 'Les Paul Std', precio: 329990, stock: 4, descripcion: 'Cuerpo caoba, tapa arce, pastillas humbucker.', imagen: 'ge002.jpg' },
    { id: 8, codigo: 'GE003', categoria: 'Guitarras Eléctricas', nombre: 'Guitarra Eléctrica SG', marca: 'Epiphone', modelo: 'SG Standard', precio: 319990, stock: 3, descripcion: 'Cuerpo caoba, mástil caoba, 2 humbuckers.', imagen: 'ge003.jpg' },
    { id: 9, codigo: 'GE004', categoria: 'Guitarras Eléctricas', nombre: 'Guitarra Eléctrica Telecaster', marca: 'Squier', modelo: 'Affinity Tele', precio: 239990, stock: 4, descripcion: 'Cuerpo álamo, clavijero vintage, 2 pastillas single.', imagen: 'ge004.jpg' },
    { id: 10, codigo: 'GE005', categoria: 'Guitarras Eléctricas', nombre: 'Guitarra Eléctrica Semi-hollow', marca: 'Epiphone', modelo: 'ES-335', precio: 549990, stock: 2, descripcion: 'Semi-hueca, 2 humbuckers, ideal para jazz y blues.', imagen: 'ge005.jpg' },
    { id: 11, codigo: 'BA001', categoria: 'Bajos Eléctricos', nombre: 'Bajo Eléctrico 4 Cuerdas', marca: 'Squier', modelo: 'Affinity PJ', precio: 299990, stock: 5, descripcion: 'Pickup PJ, cuerpo álamo, mástil arce.', imagen: 'ba001.webp' },
    { id: 12, codigo: 'BA002', categoria: 'Bajos Eléctricos', nombre: 'Bajo Eléctrico Jazz Bass', marca: 'Fender', modelo: 'Player Jazz', precio: 699990, stock: 2, descripcion: 'Alder body, 2 Alnico V Jazz single-coil.', imagen: 'ba002.jpg' },
    { id: 13, codigo: 'BA003', categoria: 'Bajos Eléctricos', nombre: 'Bajo Acústico 4 Cuerdas', marca: 'Yamaha', modelo: 'APX700II', precio: 429990, stock: 2, descripcion: 'Electroacústico, afinador incorporado.', imagen: 'ba003.webp' },
    { id: 14, codigo: 'BT001', categoria: 'Baterías', nombre: 'Batería Acústica 5 piezas', marca: 'Pearl', modelo: 'Roadshow', precio: 599990, stock: 2, descripcion: 'Incluye stands, platillos y pedal de bombo.', imagen: 'bt001.jpg' },
    { id: 15, codigo: 'BT002', categoria: 'Baterías', nombre: 'Batería Electrónica 8 pads', marca: 'Roland', modelo: 'TD-02KV', precio: 799990, stock: 2, descripcion: 'Módulo TD-02, 8 pads de goma, pedal hi-hat.', imagen: 'bt002.webp' },
    { id: 16, codigo: 'BT003', categoria: 'Baterías', nombre: 'Caja Snare 14"', marca: 'Pearl', modelo: 'STE1450', precio: 89990, stock: 4, descripcion: 'Acero, 14x5", 10 tensores.', imagen: 'bt003.jpeg' },
    { id: 17, codigo: 'BT004', categoria: 'Baterías', nombre: 'Platillo Hi-Hat 14"', marca: 'Zildjian', modelo: 'A Series', precio: 149990, stock: 3, descripcion: 'Latón B20, sonido brillante y claro.', imagen: 'bt004.webp' },
    { id: 18, codigo: 'BT005', categoria: 'Baterías', nombre: 'Platillo Crash 16"', marca: 'Zildjian', modelo: 'A Series', precio: 129990, stock: 3, descripcion: 'Latón B20, ataque rápido.', imagen: 'bt005.webp' },
    { id: 19, codigo: 'TC001', categoria: 'Teclados y Pianos', nombre: 'Teclado Digital 61 teclas', marca: 'Yamaha', modelo: 'PSR-E373', precio: 249990, stock: 4, descripcion: '61 teclas sensibles al tacto, 622 voces.', imagen: 'tc001.webp' },
    { id: 20, codigo: 'TC002', categoria: 'Teclados y Pianos', nombre: 'Piano Digital 88 teclas', marca: 'Yamaha', modelo: 'P-45', precio: 499990, stock: 2, descripcion: '88 teclas pesadas, 10 voces, pedal sustain incluido.', imagen: 'tc002.webp' },
    { id: 21, codigo: 'TC003', categoria: 'Teclados y Pianos', nombre: 'Sintetizador 49 teclas', marca: 'Arturia', modelo: 'MiniLab MKII', precio: 129990, stock: 5, descripcion: 'MIDI controller, 49 mini teclas.', imagen: 'tc003.jpeg' },
    { id: 22, codigo: 'TC004', categoria: 'Teclados y Pianos', nombre: 'Teclado MIDI 88 teclas', marca: 'M-Audio', modelo: 'Hammer 88', precio: 399990, stock: 2, descripcion: '88 teclas martillo, sin sonidos propios.', imagen: 'tc004.jpg' },
    { id: 23, codigo: 'AM001', categoria: 'Amplificadores', nombre: 'Amplificador Guitarra 15W', marca: 'Fender', modelo: 'Frontman 15G', precio: 99990, stock: 5, descripcion: '15W, distorsión incorporada, entrada auxiliar.', imagen: 'am001.webp' },
    { id: 24, codigo: 'AM002', categoria: 'Amplificadores', nombre: 'Amplificador Guitarra 40W', marca: 'Marshall', modelo: 'MG40GFX', precio: 299990, stock: 3, descripcion: '40W, 4 canales, efectos digitales integrados.', imagen: 'am002.webp' },
    { id: 25, codigo: 'AM003', categoria: 'Amplificadores', nombre: 'Amplificador Bajo 100W', marca: 'Hartke', modelo: 'HD100', precio: 449990, stock: 2, descripcion: '100W, tweeter integrado, ecualizador de 4 bandas.', imagen: 'am003.jpg' },
    { id: 26, codigo: 'AM004', categoria: 'Amplificadores', nombre: 'Amplificador Acústico 40W', marca: 'Fishman', modelo: 'Loudbox Mini', precio: 499990, stock: 2, descripcion: '60W, 2 canales, reverb y chorus incorporados.', imagen: 'am004.jpg' },
    { id: 27, codigo: 'MI001', categoria: 'Micrófonos', nombre: 'Micrófono Dinámico Cardioide', marca: 'Shure', modelo: 'SM58', precio: 149990, stock: 8, descripcion: 'Estándar industria para voz en vivo.', imagen: 'mi001.jpg' },
    { id: 28, codigo: 'MI002', categoria: 'Micrófonos', nombre: 'Micrófono Dinámico Instrumento', marca: 'Shure', modelo: 'SM57', precio: 139990, stock: 6, descripcion: 'Ideal para captura de instrumentos y amplificadores.', imagen: 'mi002.webp' },
    { id: 29, codigo: 'MI003', categoria: 'Micrófonos', nombre: 'Micrófono Condensador', marca: 'Audio-Tech.', modelo: 'AT2020', precio: 199990, stock: 4, descripcion: 'Cardioide, XLR, ideal para grabación en estudio.', imagen: 'mi003.jpg' },
    { id: 30, codigo: 'MI004', categoria: 'Micrófonos', nombre: 'Micrófono USB de Condensador', marca: 'Blue', modelo: 'Yeti', precio: 299990, stock: 5, descripcion: 'USB, 4 patrones polares, ideal para streaming y podcast.', imagen: 'mi004.webp' },
    { id: 31, codigo: 'PE001', categoria: 'Pedales de Efectos', nombre: 'Pedal Distorsión', marca: 'Boss', modelo: 'DS-1', precio: 79990, stock: 7, descripcion: 'Clásico pedal de distorsión, 3 controles.', imagen: 'pe001.jpg' },
    { id: 32, codigo: 'PE002', categoria: 'Pedales de Efectos', nombre: 'Pedal Reverb', marca: 'Boss', modelo: 'RV-6', precio: 179990, stock: 4, descripcion: '8 modos de reverb, control de shimmer.', imagen: 'pe002.webp' },
    { id: 33, codigo: 'PE003', categoria: 'Pedales de Efectos', nombre: 'Pedal Multi-efectos', marca: 'Boss', modelo: 'ME-80', precio: 349990, stock: 2, descripcion: 'Diseño tipo pedalboard, 8 efectos simultáneos.', imagen: 'pe003.jpg' },
    { id: 34, codigo: 'PE004', categoria: 'Pedales de Efectos', nombre: 'Pedal Tuner Cromático', marca: 'Boss', modelo: 'TU-3', precio: 89990, stock: 8, descripcion: 'Afinador cromático, indicador de tono.', imagen: 'pe004.webp' },
    { id: 35, codigo: 'PE005', categoria: 'Pedales de Efectos', nombre: 'Pedal Delay', marca: 'MXR', modelo: 'Carbon Copy', precio: 179990, stock: 4, descripcion: 'Delay analógico cálido, tiempo 600ms.', imagen: 'pe005.jpg' },
    { id: 36, codigo: 'PE006', categoria: 'Pedales de Efectos', nombre: 'Pedal Overdrive', marca: 'Ibanez', modelo: 'TS9', precio: 99990, stock: 6, descripcion: 'Tube Screamer clásico, sonido suave y orgánico.', imagen: 'pe006.webp' },
    { id: 37, codigo: 'AC001', categoria: 'Accesorios', nombre: 'Cuerdas Guitarra Eléctrica 09-42', marca: 'Ernie Ball', modelo: 'Super Slinky', precio: 8990, stock: 25, descripcion: 'Juego 6 cuerdas, calibre ligero.', imagen: 'ac001.jpg' },
    { id: 38, codigo: 'AC002', categoria: 'Accesorios', nombre: 'Cuerdas Guitarra Acústica 12-53', marca: 'Ernie Ball', modelo: 'Earthwood', precio: 10990, stock: 20, descripcion: 'Bronce fósforo, sonido cálido.', imagen: 'ac002.webp' },
    { id: 39, codigo: 'AC003', categoria: 'Accesorios', nombre: 'Cuerdas Bajo 45-105', marca: 'Ernie Ball', modelo: 'Regular Slinky', precio: 14990, stock: 12, descripcion: 'Cuerdas de níquel enrollado, set 4 cuerdas.', imagen: 'ac003.webp' },
    { id: 40, codigo: 'AC004', categoria: 'Accesorios', nombre: 'Púas de Guitarra x10 (0.73mm)', marca: 'Fender', modelo: '351', precio: 3990, stock: 50, descripcion: 'Celulosa, grosor medio.', imagen: 'ac004.webp' },
    { id: 41, codigo: 'AC005', categoria: 'Accesorios', nombre: 'Capotraste Guitarra', marca: 'Dunlop', modelo: 'Trigger', precio: 12990, stock: 15, descripcion: 'Capotraste de resorte, compatible 6 cuerdas.', imagen: 'ac005.jpg' },
    { id: 42, codigo: 'AC006', categoria: 'Accesorios', nombre: 'Afinador de Clip', marca: 'Snark', modelo: 'SN-5', precio: 8990, stock: 20, descripcion: 'Afinador cromático de clip, pantalla giratoria.', imagen: 'ac006.webp' },
    { id: 43, codigo: 'AC007', categoria: 'Accesorios', nombre: 'Cable Instrumento 3m', marca: 'Monster', modelo: 'S100-I-3', precio: 12990, stock: 15, descripcion: 'Cable trenzado, conectores dorados, 3 metros.', imagen: 'ac007.webp' },
    { id: 44, codigo: 'AC008', categoria: 'Accesorios', nombre: 'Cable Instrumento 6m', marca: 'Monster', modelo: 'S100-I-6', precio: 17990, stock: 10, descripcion: 'Cable trenzado, conectores dorados, 6 metros.', imagen: 'ac008.webp' },
    { id: 45, codigo: 'AC009', categoria: 'Accesorios', nombre: 'Soporte Guitarra de Piso', marca: 'Hercules', modelo: 'GS302B', precio: 22990, stock: 12, descripcion: 'Soporte plegable con enganche automático.', imagen: 'ac009.webp' },
    { id: 46, codigo: 'AC010', categoria: 'Accesorios', nombre: 'Soporte Guitarra de Pared', marca: 'Hercules', modelo: 'WAH-202', precio: 18990, stock: 10, descripcion: 'Montaje a pared, enganche automático.', imagen: 'ac010.jpg' },
    { id: 47, codigo: 'ES001', categoria: 'Estudio y Grabación', nombre: 'Interfaz de Audio 2x2 USB', marca: 'Focusrite', modelo: 'Scarlett Solo', precio: 149990, stock: 4, descripcion: '1 entrada XLR+instrumento, 2 salidas, 24bit/192kHz.', imagen: 'es001.jpg' },
    { id: 48, codigo: 'ES002', categoria: 'Estudio y Grabación', nombre: 'Auriculares de Estudio', marca: 'Audio-Tech.', modelo: 'ATH-M20x', precio: 79990, stock: 6, descripcion: 'Circumaurales, respuesta 15Hz-20kHz.', imagen: 'es002.webp' },
    { id: 49, codigo: 'ES003', categoria: 'Estudio y Grabación', nombre: 'Auriculares de Estudio Pro', marca: 'Audio-Tech.', modelo: 'ATH-M50x', precio: 219990, stock: 4, descripcion: 'Referencia de industria, sonido neutro y detallado.', imagen: 'es003.webp' },
    { id: 50, codigo: 'ES004', categoria: 'Estudio y Grabación', nombre: 'Monitor de Estudio 5"', marca: 'Yamaha', modelo: 'HS5', precio: 349990, stock: 2, descripcion: 'Altavoz activo, respuesta plana, ideal mezcla.', imagen: 'es004.webp' },
    { id: 51, codigo: 'ES005', categoria: 'Estudio y Grabación', nombre: 'Pop Filter para Micrófono', marca: 'Sennheiser', modelo: 'MZP 40', precio: 14990, stock: 8, descripcion: 'Doble malla, brazo flexible con clip.', imagen: 'es005.jpg' },
];

export const categorias: string[] = [...new Set(productos.map((producto) => producto.categoria))];
