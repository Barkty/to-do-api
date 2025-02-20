import development from './development';
import production from './production';
import test from './test';

export default {
  development,
  production,
  test,
}[process.env.STASHWISE_NODE_ENV || 'development'];
