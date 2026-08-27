package com.mahfazati.app

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews

class MahfazatiWidgetProvider : AppWidgetProvider() {

    companion object {
        const val PREFS_NAME = "MahfazatiWidgetPrefs"
        const val KEY_BALANCE = "widget_balance_text"
        const val KEY_LABEL = "widget_label_text"
        const val KEY_UPDATED = "widget_updated_text"

        fun updateAllWidgets(context: Context) {
            val manager = AppWidgetManager.getInstance(context)
            val ids = manager.getAppWidgetIds(
                android.content.ComponentName(context, MahfazatiWidgetProvider::class.java)
            )
            for (id in ids) {
                updateWidget(context, manager, id)
            }
        }

        fun updateWidget(context: Context, manager: AppWidgetManager, widgetId: Int) {
            val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            val balance = prefs.getString(KEY_BALANCE, "—") ?: "—"
            val label = prefs.getString(KEY_LABEL, "صافي الثروة") ?: "صافي الثروة"
            val updated = prefs.getString(KEY_UPDATED, "") ?: ""

            val views = RemoteViews(context.packageName, R.layout.widget_mahfazati)
            views.setTextViewText(R.id.widget_balance, balance)
            views.setTextViewText(R.id.widget_label, label)
            views.setTextViewText(R.id.widget_updated, updated)

            // فتح التطبيق عند الضغط على الودجيت
            val launchIntent = context.packageManager.getLaunchIntentForPackage(context.packageName)
            val pendingIntent = PendingIntent.getActivity(
                context, 0, launchIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_root, pendingIntent)

            manager.updateAppWidget(widgetId, views)
        }
    }

    override fun onUpdate(context: Context, manager: AppWidgetManager, ids: IntArray) {
        for (id in ids) {
            updateWidget(context, manager, id)
        }
    }

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        if (intent.action == AppWidgetManager.ACTION_APPWIDGET_UPDATE ||
            intent.action == "com.mahfazati.app.WIDGET_DATA_UPDATED") {
            updateAllWidgets(context)
        }
    }
}
