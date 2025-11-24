import stringifyObject from './buffer.js'

const samples = [
  { name: 'haluk', mail: 'halyk@gmail.com', elevator: null },
  { name: 'haluk', mail: ' ', elevator: undefined },
  { name: '', mail: 'someone@example.com', extra: {} },
  { name: '   ', mail: '', notes: [] },
  { name: 'alice', score: 0, active: false },
  null,
  undefined,
]

for (const s of samples) {
  console.log('INPUT:', s)
  console.log('OUT :', stringifyObject(s))
  console.log('---')
}
