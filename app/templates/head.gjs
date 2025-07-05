import RouteTemplate from 'ember-route-template'

export default RouteTemplate(<template>{{#if @controller.model.title}}
  <meta property="og:title" content={{@controller.model.title}} />
  <meta name="twitter:title" content={{@controller.model.title}} />
{{else}}
  <meta property="og:title" content="datafruits.fm" />
  <meta name="twitter:title" content="datafruits.fm" />
{{/if}}

{{#if @controller.model.description}}
  <meta property="og:description" content={{@controller.model.description}} />
  <meta name="twitter:description" content={{@controller.model.description}} />
{{else}}
  <meta property="og:description" content="DATAFRUITS.FM is the world wide web's wackiest radio station. It's just a website." />
  <meta name="twitter:description" content="DATAFRUITS.FM is the world wide web's wackiest radio station. It's just a website." />
{{/if}}

{{#if @controller.model.image}}
  <meta property="og:image" content={{@controller.model.image}} />
  <meta name="twitter:image" content={{@controller.model.image}} />
{{else}}
  <meta property="og:image" content="{{@controller.rootURL}}assets/images/logo.png" />
  <meta name="twitter:image" content="{{@controller.rootURL}}assets/images/logo.png" />
{{/if}}</template>)