export default function (server) {
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
    ],
    shrimpos: [
      { title: "maximum glorp", status: 'running', description: "glorp and glop it up, don't hold back. maximize the glorp!", slug: 'maximum-glorp' },
      { title: "deeyex and deeyef's album", status: 'voting', description: "imagine deeyex and deeyef made a eurobeat album in the style of aqua, randy and mandy, etc. lyrics encouraged!", slug: 'deeyex-and-deeyefs-album' },
      { title: "new jingle contest", status: 'completed', description: "it's time this site had some new jingles. maximum 30 seconds is encouraged. use any of the samples provided, or not, create new voice samples if you like!", slug: 'new-jingle-contest' },
    ]
  });
}
