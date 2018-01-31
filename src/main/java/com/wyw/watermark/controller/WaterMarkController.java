package com.wyw.watermark.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * @author wyw
 * @date 2018\1\31 0031 14:04
 */
@Controller
public class WaterMarkController {

    @GetMapping(value = "/index")
    public String index() {
        return "html/watermark.html";
    }

}
