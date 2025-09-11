#!/bin/bash

# Update the science screen in index.html
sed -i '/<!-- Science Screen -->/,/<!-- Calendar Screen -->/c\
            <!-- Science Screen -->\
            <div id="science-screen" class="tab-content">\
                <div class="science-container">\
                    <h2>Concentrate Science</h2>\
                    \
                    <div class="concentrate-selector">\
                        <select id="concentrate-select">\
                            <option value="shatter">Shatter</option>\
                            <option value="wax">Wax</option>\
                            <option value="resin">Live Resin</option>\
                            <option value="rosin">Rosin</option>\
                            <option value="budder">Budder</option>\
                        </select>\
                    </div>\
                    \
                    <div class="concentrate-info active" id="shatter-info">\
                        <div class="concentrate-header">\
                            <h3>Shatter</h3>\
                            <img src="img/science-shatter.jpg" alt="Shatter">\
                        </div>\
                        <div class="concentrate-details">\
                            <p class="concentrate-description">A translucent, glass-like extract that fractures easily. High THC content with preserved terpene profile.</p>\
                            \
                            <div class="temp-info">\
                                <h4>Ideal Vaporization Temperature</h4>\
                                <p class="temp-range">315-400°F (157-204°C)</p>\
                                <p class="science-note">Preserves delicate terpenes like α-Pinene (311°F) and β-Myrcene (334°F)</p>\
                            </div>\
                            \
                            <div class="concentrate-properties">\
                                <div class="property">\
                                    <span class="property-label">THC Content:</span>\
                                    <span class="property-value">70-90%</span>\
                                </div>\
                                <div class="property">\
                                    <span class="property-label">Common Terpenes:</span>\
                                    <span class="property-value">Pinene, Myrcene, Limonene</span>\
                                </div>\
                                <div class="property">\
                                    <span class="property-label">Consistency:</span>\
                                    <span class="property-value">Brittle, Glass-like</span>\
                                </div>\
                                <div class="property">\
                                    <span class="property-label">Best For:</span>\
                                    <span class="property-value">Flavorful, low-temp dabs</span>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    \
                    <!-- Additional concentrate info would go here -->\
                    \
                </div>\
            </div>' index.html
