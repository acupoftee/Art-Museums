function Map(opts) {
    var self = this;
    if (!(this instanceof Map)) return new Map(opts);
    if (!opts) opts = {};

    self.width = opts.width || window.innerWidth;
    self.height = opts.height || window.innerHeight;
    self.zooms = opts.zooms || [500, 1000, 1500]
    self.zoomIndex = -1; // full view of map at launch

    // initialize map projection.
    // orthographic gives it a round projection
    self.projection = d3.geoOrthographic()
      .translate([self.width/2, self.height/3])
      .scale(self.width/2)
      .clipAngle(90)
      .precision(1);

    // make the globe a full sized one
    // using svg so that we don't have to redraw the map 
    // everytime it rotates
    self.svg = d3.select("#instagram-map").append("svg")
      .attr("fill", "#4796a5")
      .attr("width", self.width)
      .attr("height", self.height)
}

/**
 * makes a map with borders and countries
 */
Map.prototype.render = function() {
    var self = this;
    d3.json("/world-110m", function(error, world) {
        self.land = topojson.feature(world, world.objects.land),
        self.svgLand = self.svg.append("path").datum(self.land).attr("d", self.path);
    });
}

/**
 * controlls zooming and rotating by interpolating
 * through svg data
 */
Map.prototype.step = function(position, callback) {
    var self = this;

    // return to default zoom if we're too deep
    if (++self.zoomIndex >= self.zooms.length) self.zoomIndex = 0; 

    d3.transition()
        .duration(2000)
        .tween("rotate", function() {
            var point = position,
                rotate = d3.interpolate(self.projection.rotate(), [-point[0], -point[1]]),
                scale = d3.interpolate(self.projection.scale(), (self.zooms[self.zoomIndex]/0.5));
            return function(t) {
                self.projection 
                    .rotate(rotate(t))
                    .scale(scale(t))
                self.svgLang.attr("d", self.path);
            };
        })
        .each("end", callback)
}

