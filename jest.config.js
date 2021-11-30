module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  globals: {
    tags: {
      create: '#CREATE',
      read: '#READ',
      update: '#UPDATE',
      delete: '#DELETE',
  
      positive: '#POSITIVE',
      negative: '#NEGATIVE'
    }
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
}