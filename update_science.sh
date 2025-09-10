#!/bin/bash
# This script will update the science section in index.html
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
                            <option value="crumble">Crumble</option>\
                            <option value="live_resin">Live Resin</option>\
                        </select>\
                    </div>\
                    \
                    <div class="concentrate-info active" id="shatter-info">\
                        <div class="concentrate-header">\
                            <h3>Shatter</h3>\
                            <img src="img/science-shatter.jpg" alt="Shatter">\
                        </div>\
                        <div class="concentrate-details">\
                            <p>A translucent, glass-like extract that fractures easily. High THC content with preserved terpene profile.</p>\
                            <div class="temp-info">\
                                <h4>Ideal Vaporization Temperature</h4>\
                                <p>315-400°F (157-204°C)</p>\
                                <p class="science-note">Preserves delicate terpenes like α-Pinene (311°F) and β-Myrcene (334°F)</p>\
                            </div>\
                            <div class="data-points">\
                                <div class="data-point">\
                                    <span class="data-label">THC Percentage</span>\
                                    <span class="data-value">70-90%</span>\
                                </div>\
                                <div class="data-point">\
                                    <span class="data-label">Consistency</span>\
                                    <span class="data-value">Brittle, Glass-like</span>\
                                </div>\
                                <div class="data-point">\
                                    <span class="data-label">Best For</span>\
                                    <span class="data-value">Flavorful, low-temp dabs</span>\
                                </div>\
                                <div class="data-point">\
                                    <span class="data-label">Terpene Preservation</span>\
                                    <span class="data-value">Excellent</span>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    \
                    <!-- Additional concentrate info would go here -->\
                    \
                    <div class="material-science-table">\
                        <h3>Material Heating Guide</h3>\
                        <table>\
                            <thead>\
                                <tr>\
                                    <th>Material</th>\
                                    <th>Thickness</th>\
                                    <th>Heat Time (s)</th>\
                                    <th>Cool Time (s)</th>\
                                    <th>Thermal Properties</th>\
                                </tr>\
                            </thead>\
                            <tbody>\
                                <tr>\
                                    <td>Quartz</td>\
                                    <td>1mm</td>\
                                    <td>15-20</td>\
                                    <td>25-30</td>\
                                    <td>Fast heat, excellent flavor</td>\
                                </tr>\
                                <tr>\
                                    <td>Quartz</td>\
                                    <td>2mm</td>\
                                    <td>25-30</td>\
                                    <td>40-45</td>\
                                    <td>Balanced heat retention</td>\
                                </tr>\
                                <tr>\
                                    <td>Quartz</td>\
                                    <td>4mm</td>\
                                    <td>40-45</td>\
                                    <td>60-65</td>\
                                    <td>Excellent heat retention</td>\
                                </tr>\
                                <tr>\
                                    <td>Titanium</td>\
                                    <td>N/A</td>\
                                    <td>20-25</td>\
                                    <td>30-35</td>\
                                    <td>Durable, fast heating</td>\
                                </tr>\
                                <tr>\
                                    <td>Ceramic</td>\
                                    <td>N/A</td>\
                                    <td>45-50</td>\
                                    <td>65-70</td>\
                                    <td>Excellent flavor, fragile</td>\
                                </tr>\
                                <tr>\
                                    <td>Borosilicate</td>\
                                    <td>2mm</td>\
                                    <td>30-35</td>\
                                    <td>45-50</td>\
                                    <td>Thermal shock resistant</td>\
                                </tr>\
                            </tbody>\
                        </table>\
                        <p class="table-note">Times based on butane torch heating. Adjust for other heating elements.</p>\
                    </div>\
                </div>\
            </div>' index.html
