export default function (/* server */) {
  /*
    Seed your development database using your factories.
    This data will not be loaded in your tests.
  */
  // server.createList('post', 10);
  //
    server.db.loadData({
    microtexts: [
      { content: 'i like the website', username: 'ovenrake' },
      { content: 'i like the website', username: 'ovenrake' },
      { content: 'i like the website', username: 'ovenrake' },
    ]
  });

}
