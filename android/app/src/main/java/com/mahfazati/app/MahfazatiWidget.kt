package com.mahfazati.app

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews

class MahfazatiWidget : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    companion object {
        fun updateAppWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            // Capacitor's Preferences plugin يخزن البيانات فـ SharedPreferences
            // بهاد الاسم الافتراضي: "CapacitorStorage"
            val prefs = context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE)

            val accLabel = prefs.getString("widget_acc_label", "اختر حساب من الإعدادات") ?: "—"
            val accBalance = prefs.getString("widget_acc_balance", "—") ?: "—"
            val indLabel = prefs.getString("widget_ind_label", "مؤشر الصحة") ?: "—"
            val indValue = prefs.getString("widget_ind_value", "—") ?: "—"

            val views = RemoteViews(context.packageName, R.layout.mahfazati_widget_layout)
            views.setTextViewText(R.id.widget_acc_label, accLabel)
            views.setTextViewText(R.id.widget_acc_balance, accBalance)
            views.setTextViewText(R.id.widget_ind_label, indLabel)
            views.setTextViewText(R.id.widget_ind_value, indValue)

            // زر الدخول للتطبيق
            val launchIntent = context.packageManager.getLaunchIntentForPackage(context.packageName)
            val pendingIntent = PendingIntent.getActivity(
                context, 0, launchIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_open_button, pendingIntent)
            views.setOnClickPendingIntent(R.id.widget_root, pendingIntent)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
