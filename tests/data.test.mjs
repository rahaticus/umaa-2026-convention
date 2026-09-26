import test from 'node:test'; import assert from 'node:assert/strict'; import seed from '../data/sessions_seed.json' with {type:'json'};
const slug=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
test('session ids are unique and sourced',()=>{const ids=seed.sessions.map(s=>s.id);assert.equal(new Set(ids).size,ids.length);assert.ok(seed.sessions.every(s=>s.sourcePages?.length))});
test('session slugs are unique',()=>{const slugs=seed.sessions.map(s=>`${slug(s.title)}-${s.id}`);assert.equal(new Set(slugs).size,slugs.length)});
test('times have valid intervals',()=>assert.ok(seed.sessions.every(s=>!s.startTime||!s.endTime||s.startTime<s.endTime)));
test('dates fall during convention',()=>assert.ok(seed.sessions.every(s=>['2026-10-09','2026-10-10','2026-10-11'].includes(s.date))));
test('ladies-only canonical metadata reconciles seven explicit program occurrences',()=>{const ids=seed.sessions.filter(s=>s.audience.includes('ladies only')||s.audience.includes('females only')).map(s=>s.id);assert.deepEqual(ids,['fri_mothers_lounge','sat_movement_heal','sat_women_ahlul_bayt','sat_mothers_lounge','sun_strength_all_ages','sun_sukooni_teens','sun_mothers_lounge']);assert.equal(new Set(ids).size,ids.length)});
