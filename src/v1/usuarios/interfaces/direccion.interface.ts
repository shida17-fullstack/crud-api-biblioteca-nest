/**
 * Representa una dirección con diversos campos para la ubicación.
 *
 * @interface Direccion
 */
export interface Direccion {
  /**
   * La calle de la dirección.
   *
   * @type {string}
   */
  calle: string;

  /**
   * El número de la dirección.
   *
   * @type {string}
   */
  numero: string;

  /**
   * La ciudad de la dirección.
   *
   * @type {string}
   */
  ciudad: string;

  /**
   * La provincia de la dirección.
   *
   * @type {string}
   */
  provincia: string;

  /**
   * El país de la dirección.
   *
   * @type {string}
   */
  pais: string;
}
