import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class DjsController extends Controller {
  @service router;
  queryParams = ["query", "page", "tags"];
}
