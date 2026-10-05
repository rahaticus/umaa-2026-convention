import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import seed from '../data/sessions_seed.json' with {type:'json'};
import roomData from '../data/rooms.json' with {type:'json'};
const session=id=>seed.sessions.find(s=>s.id===id);
test('final program reconciles moved and replaced sessions without losing the saved blind-faith identity',()=>{
  assert.equal(seed.source,'Final Convention 2026 Program.pdf');
  assert.equal(seed.sessions.length,53);
  assert.equal(session('sun_blind_faith').date,'2026-10-10');
  assert.equal(session('sun_blind_faith').startTime,'19:30');
  assert.equal(session('sat_politics_influence'),undefined);
  assert.equal(session('sun_islamic_jeopardy'),undefined);
  assert.equal(session('sun_rob_turfe_podcast').startTime,'13:45');
  assert.equal(session('sun_rob_turfe_podcast').endTime,'14:45');
  assert.equal(session('sun_conversation_architect').room,'Orchid + Violet');
});
test('final program changes propagate to canonical room and calendar data',()=>{
  for(const [id,start,end,room] of [
    ['sat_movement_heal','09:00','10:00','Maple'],
    ['sun_strength_all_ages','09:00','10:00','Maple'],
    ['sat_youth_ummah_builders','15:30','17:00','Primrose'],
    ['sat_belief_action_zahra_trust','17:15','18:45','Orchid + Violet'],
    ['sun_centres_next','17:15','18:45','Holly + Butternut'],
    ['sun_stand_dignity','17:15','18:45','Orchid + Violet'],
    ['sun_academic_planning','10:00','11:30','Trillium Boardroom'],
    ['sun_habib','09:00','16:30','Orchid + Violet'],
    ['sun_shiism_contexts','11:30','13:00','Maple'],
    ['sun_palestine_action','11:30','13:00','Holly + Butternut'],
    ['sun_ballot','15:00','16:30','Holly + Butternut'],
    ['sun_sukooni_teens','15:00','17:00','Maple'],
    ['sun_rooted_together_under6','10:00','12:00','Primrose'],
    ['sun_little_umaah','15:00','17:00','Primrose']
  ]) assert.deepEqual([session(id).startTime,session(id).endTime,session(id).room],[start,end,room],id);
  assert.ok(seed.sessions.every(s=>roomData.rooms.some(r=>r.displayName===s.room)));
  assert.equal(session('sun_research_showcase').startTime,'13:00');
  assert.equal(session('sun_research_showcase').room,'Birch');
  assert.equal(session('fri_research_showcase').startTime,null);
  assert.match(session('sun_habib').notes,/imicanada.org/);
});
test('children eligibility and new speaker bio match the revised program',async()=>{
  const children=seed.sessions.filter(s=>s.category==='children');
  assert.equal(children.length,9);
  assert.ok(children.every(s=>!s.audience.includes('ages 7 to 11')));
  const bios=JSON.parse(await readFile('data/speaker_bios_clean.json','utf8'));
  assert.match(bios.speakers.find(s=>s.sourceName==='Rob Turfe').bio,/DAY OF ASHURA/);
});
