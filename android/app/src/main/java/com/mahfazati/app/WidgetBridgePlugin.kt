package com.mahfazati.app

import android.content.Context
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "WidgetBridge")
class WidgetBridgePlugin : Plugin() {

    @PluginMethod
    fun updateWidget(call: PluginCall) {
        val balance = call.getString("balance") ?: "0.00"
        val label = call.getString("label") ?: "صافي الثروة"
        val updated = call.getString("updated") ?: ""

        val prefs = context.getSharedPreferences(
            MahfazatiWidgetProvider.PREFS_NAME, Context.MODE_PRIVATE
        )
        prefs.edit()
            .putString(MahfazatiWidgetProvider.KEY_BALANCE, balance)
            .putString(MahfazatiWidgetProvider.KEY_LABEL, label)
            .putString(MahfazatiWidgetProvider.KEY_UPDATED, updated)
            .apply()

        MahfazatiWidgetProvider.updateAllWidgets(context)
        call.resolve()
    }
}
