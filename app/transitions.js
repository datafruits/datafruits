export default function(){
  // Add your transitions here, like:
  this.transition(
    this.hasClass('vehicles'),
    this.use('toDown', {duration: 75})
  );

}
