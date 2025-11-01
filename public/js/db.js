//realtime
db.collection("prophesies").onsnapshot((snapshot) => {
 // console.log(snapshot.docChanges());
  snapshot.docChanges().forEach(change => {
    console.log(change);
  });
});

