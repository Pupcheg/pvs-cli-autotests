import json
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any, Optional


def generate_report(
    results: List[Dict[str, Any]],
    output_path: str = "report.md",
    analyzer_version: Optional[str] = None
) -> None:
    """
    Генерирует отчёт report.md по результатам тестирования.
    
    Параметры:
    - results: список словарей с результатами каждого теста.
      Каждый словарь должен содержать поля:
      {
        "case_name": str,               # Название кейса
        "requirement": str,             # Цитата из спецификации
        "description": str,             # Что проверяем (ожидаемое поведение)
        "test_data": str,               # Описание тестовых данных и путь
        "command": str,                 # Точная команда запуска
        "actual": str,                  # Фактический результат (код, вывод)
        "status": str,                  # "соответствует" / "не соответствует" / "частично"
        "direction": str                # Направление проверки
      }
    - output_path: путь до файла отчёта (по умолчанию report.md)
    - analyzer_version: версия анализатора (вывод pvs-js --version)
    """
    def get_status_icon(status: str) -> str:
        """Возвращает иконку для статуса."""
        status_lower = status.lower()
        if status_lower == "соответствует":
            return "✅"
        elif status_lower == "не соответствует":
            return "❌"
        elif status_lower == "частично":
            return "⚠️"
        return "❓"

    # Считаем статистику по статусам
    status_counts = {}
    for r in results:
        status = r.get("status", "неизвестно")
        status_counts[status] = status_counts.get(status, 0) + 1

    # Формируем содержимое отчёта
    lines = []
    lines.append("# Отчёт о тестировании CLI анализатора PVS-Studio JavaScript/TypeScript")
    lines.append("")
    lines.append(f"**Дата создания отчёта:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    if analyzer_version:
        lines.append(f"**Версия анализатора:** `{analyzer_version}`")
    lines.append("")
    lines.append("---")
    lines.append("")

    # Раздел 1: Кейсы
    lines.append("## 1. Кейсы")
    lines.append("")

    for i, r in enumerate(results, start=1):
        case_name = r.get('case_name', f'Кейс {i}')
        status = r.get('status', 'неизвестно')
        lines.append(f"### Кейс {i}: {case_name}")
        lines.append("")
        lines.append(f"- **Требование:** {r.get('requirement', 'Не указано')}")
        lines.append(f"- **Что проверяем:** {r.get('description', 'Не указано')}")
        lines.append(f"- **Тестовые данные:** {r.get('test_data', 'Не указано')}")
        lines.append(f"- **Как воспроизвести:** `{r.get('command', 'Не указана')}`")
        lines.append(f"- **Фактический результат:** {r.get('actual', 'Не указан')}")
        lines.append(f"- **Вывод:** {get_status_icon(status)} {status}")
        lines.append("")

    # Раздел 2: Результаты
    lines.append("---")
    lines.append("")
    lines.append("## 2. Результаты")
    lines.append("")

    # 2.1 Сводная таблица
    lines.append("### Сводная таблица")
    lines.append("")
    lines.append("| № | Кейс | Направление | Статус |")
    lines.append("|---|------|-------------|--------|")

    for i, r in enumerate(results, start=1):
        case_name = r.get('case_name', f'Кейс {i}')
        direction = r.get('direction', 'CLI')
        status = r.get('status', 'неизвестно')
        lines.append(f"| {i} | {case_name} | {direction} | {get_status_icon(status)} {status} |")

    lines.append("")

    # 2.2 Перечень найденных расхождений
    lines.append("### Перечень найденных расхождений")
    lines.append("")
    mismatches = [r for r in results if r.get('status', '').lower() in ["не соответствует", "частично"]]
    if mismatches:
        for r in mismatches:
            case_name = r.get('case_name', 'Кейс')
            actual = r.get('actual', 'Не указано')
            lines.append(f"- **{case_name}**: {actual}")
    else:
        lines.append("Расхождений не найдено.")
    
    lines.append("")

    # 2.3 Общий вывод
    lines.append("### Общий вывод о соответствии проверенных разделов")
    lines.append("")
    
    total = len(results)
    passed = status_counts.get("соответствует", 0)
    partial = status_counts.get("частично", 0)
    failed = status_counts.get("не соответствует", 0)
    
    lines.append(f"Всего проверено кейсов: **{total}**")
    lines.append(f"- {get_status_icon('соответствует')} Соответствует: **{passed}**")
    if partial > 0:
        lines.append(f"- {get_status_icon('частично')} Частично соответствует: **{partial}**")
    if failed > 0:
        lines.append(f"- {get_status_icon('не соответствует')} Не соответствует: **{failed}**")
    
    lines.append("")
    if failed == 0 and partial == 0:
        lines.append("**Вывод:** Все проверенные кейсы полностью соответствуют спецификации.")
    elif failed == 0 and partial > 0:
        lines.append("**Вывод:** Большинство кейсов соответствует, но есть частичные расхождения, требующие уточнения у разработчиков.")
    else:
        lines.append("**Вывод:** Обнаружены расхождения со спецификацией, требуется доработка анализатора.")

    # Записываем файл
    output_file = Path(output_path)
    output_file.parent.mkdir(parents=True, exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    
    # Вывод в консоль
    print(f"\nОтчёт сохранён: {output_file.absolute()}")
    print(f"Всего кейсов: {total}")
    print(f"- Соответствует: {passed}")
    if partial > 0:
        print(f"- Частично соответствует: {partial}")
    if failed > 0:
        print(f"- Не соответствует: {failed}")
    print("")


# Пример использования
if __name__ == "__main__":
    results = [
        {
            "case_name": "Неизвестный флаг в CLI",
            "requirement": "п. 2.2.14 - при неверной конфигурации CLI код возврата 2",
            "description": "Передача --unknown-flag приводит к коду возврата 2",
            "test_data": "fixtures/case-01-unknown-flag/ (пустая директория)",
            "command": "pvs-js analyze ./fixtures/case-01-unknown-flag/ --unknown-flag",
            "actual": "код возврата 2, stderr содержит 'unknown flag'",
            "status": "соответствует",
            "direction": "Коды возврата"
        }
    ]
    generate_report(results, analyzer_version="1.2.3")