module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  coverageDirectory: 'coverage',
  moduleNameMapper: {
    '^@libros/(.*)$': '<rootDir>/src/v1/libros/$1',
    '^@usuarios/(.*)$': '<rootDir>/src/v1/usuarios/$1',
    '^@prestamos/(.*)$': '<rootDir>/src/v1/prestamos/$1',
    '^@reservas/(.*)$': '<rootDir>/src/v1/reservas/$1',
    '^@auth/(.*)$': '<rootDir>/src/v1/auth/$1', // Alias para auth
    '^@roles/(.*)$': '<rootDir>/src/v1/roles/$1', // Alias para roles
    '^@src/(.*)$': '<rootDir>/src/$1', // Alias para src
    '^@test/(.*)$': '<rootDir>/test/$1', // Alias para test fuera de src
  },
};
