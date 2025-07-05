import RouteTemplate from 'ember-route-template'
import pageTitle from "ember-page-title/helpers/page-title";
import t from "ember-intl/helpers/t";
import TimetableCalendar from "../../components/timetable-calendar.js";
export default RouteTemplate(<template>{{pageTitle "Timetable"}}
<div class="page-spacing">
  <h1 class="debussy-header">{{t "timetable.title"}}</h1>
  <p>
    <TimetableCalendar />
  </p>
</div>
</template>)