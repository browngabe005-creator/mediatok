// Progressive v93 event capture. Event time means time MediaTok received the
// action, not an imported episode's original watch/read date.
export async function recordMediaActivity(db,{userId,mediaKey,mediaType,eventKind,previousStatus=null,status=null,progress=null,rating=null,source='manual',occurredAt=Date.now()}){
  try {
    await db.prepare(`INSERT INTO media_activity_events(user_id,media_key,media_type,event_kind,status_before,status_after,progress_after,rating_after,source,occurred_at) VALUES(?,?,?,?,?,?,?,?,?,?)`)
      .bind(userId,mediaKey,mediaType,eventKind,previousStatus,status,progress,rating,source,occurredAt).run();
    return true;
  } catch(err) {
    // No logging operation should be lost if this additive migration isn't
    // deployed yet. Check logs and apply 0016 before relying on Wrapped stats.
    console.warn('MediaTok activity-event capture skipped:',err?.message||err);
    return false;
  }
}
