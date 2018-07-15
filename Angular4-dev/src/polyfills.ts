// import 'es6-shim';
import 'reflect-metadata';
import 'ts-helpers';

require('zone.js/dist/zone');

if (ENV === 'production') {
    // Production
} else {
    // Development
    Error['stackTraceLimit'] = Infinity;
    require('zone.js/dist/long-stack-trace-zone');
}
