package com.ischoolbar.programmer.controller.admin;

import com.ischoolbar.programmer.entity.admin.Floor;
import com.ischoolbar.programmer.page.admin.Page;
import com.ischoolbar.programmer.service.admin.FloorService;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.Map;

/**
 * ¥������̨������
 *
 * @author Administrator
 */
@RequestMapping("/admin/floor")
@Controller
public class FloorController {

    @Autowired
    private FloorService floorService;


    /**
     * ¥������б�ҳ��
     *
     * @param model
     * @return
     */
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public ModelAndView list(ModelAndView model) {
        model.setViewName("floor/list");
        return model;
    }

    /**
     * ¥����Ϣ��Ӳ���
     *
     * @param floor
     * @return
     */
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, String> add(Floor floor) {
        Map<String, String> ret = new HashMap<String, String>();
        if (floor == null) {
            ret.put("type", "error");
            ret.put("msg", "����д��ȷ��¥����Ϣ!");
            return ret;
        }
        if (StringUtils.isEmpty(floor.getName())) {
            ret.put("type", "error");
            ret.put("msg", "¥�����Ʋ���Ϊ��!");
            return ret;
        }
        if (floorService.add(floor) <= 0) {
            ret.put("type", "error");
            ret.put("msg", "���ʧ�ܣ�����ϵ����Ա!");
            return ret;
        }
        ret.put("type", "success");
        ret.put("msg", "��ӳɹ�!");
        return ret;
    }

    /**
     * ¥����Ϣ�༭����
     *
     * @param floor
     * @return
     */
    @RequestMapping(value = "/edit", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, String> edit(Floor floor) {
        Map<String, String> ret = new HashMap<String, String>();
        if (floor == null) {
            ret.put("type", "error");
            ret.put("msg", "����д��ȷ��¥����Ϣ!");
            return ret;
        }
        if (StringUtils.isEmpty(floor.getName())) {
            ret.put("type", "error");
            ret.put("msg", "¥�����Ʋ���Ϊ��!");
            return ret;
        }
        if (floorService.edit(floor) <= 0) {
            ret.put("type", "error");
            ret.put("msg", "�޸�ʧ�ܣ�����ϵ����Ա!");
            return ret;
        }
        ret.put("type", "success");
        ret.put("msg", "�޸ĳɹ�!");
        return ret;
    }

    /**
     * ��ҳ��ѯ¥����Ϣ
     *
     * @param name
     * @param page
     * @return
     */
    @RequestMapping(value = "/list", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> list(
            @RequestParam(name = "name", defaultValue = "") String name,
            Page page
    ) {
        Map<String, Object> ret = new HashMap<String, Object>();
        Map<String, Object> queryMap = new HashMap<String, Object>();
        queryMap.put("name", name);
        queryMap.put("offset", page.getOffset());
        queryMap.put("pageSize", page.getRows());
        ret.put("rows", floorService.findList(queryMap));
        ret.put("total", floorService.getTotal(queryMap));
        return ret;
    }

    /**
     * ¥����Ϣɾ������
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, String> delete(Long id) {
        Map<String, String> ret = new HashMap<String, String>();
        if (id == null) {
            ret.put("type", "error");
            ret.put("msg", "��ѡ��Ҫɾ������Ϣ!");
            return ret;
        }
        try {
            if (floorService.delete(id) <= 0) {
                ret.put("type", "error");
                ret.put("msg", "ɾ��ʧ�ܣ�����ϵ����Ա!");
                return ret;
            }
        } catch (Exception e) {
            // TODO: handle exception
            ret.put("type", "error");
            ret.put("msg", "��¥���´��ڷ�����Ϣ������ɾ����¥���µ����з�����Ϣ!");
            return ret;
        }
        ret.put("type", "success");
        ret.put("msg", "ɾ���ɹ�!");
        return ret;
    }
}
