import EN from './ingles';
import ES from './spanish';
import KO from './coreano';
/**
 ******************
 * REQUERIMIENTOS *
 ******************
 * El nombre que se le debe dar a la clave de cada idioma que es importado y exportado
 * Es requerido que coincidad con el valor de la columna 'cod' en la table 'languages'
 * de la base de datos, en caso contrario no se podrá hacer las traducciones personalizadas
 * de los módulos de la compañia
 */
export default {
	ES,
	EN,
	KO,
}