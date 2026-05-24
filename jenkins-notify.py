#!/usr/bin/env python3
import smtplib, ssl, sys, os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

sender   = "papalioune03@gmail.com"
receiver = "papalioune03@gmail.com"
password = "tupwiixitmfsbnlb"
job      = os.environ.get("JOB_NAME", "myPortfolio")
build    = os.environ.get("BUILD_NUMBER", "?")
status   = sys.argv[1] if len(sys.argv) > 1 else "SUCCESS"
url      = os.environ.get("BUILD_URL", "http://192.168.93.239:8090")
is_success = status.upper() == "SUCCESS"
color  = "#2E75B6" if is_success else "#C00000"
subject = f"Jenkins - {job} #{build} - {status}"
body = f"<html><body><h2 style=color:{color};>Pipeline Jenkins - {status}</h2><table><tr><td><b>Projet</b></td><td>{job}</td></tr><tr><td><b>Build</b></td><td>#{build}</td></tr><tr><td><b>Statut</b></td><td>{status}</td></tr></table><p><a href={url}console>Voir les logs</a></p><p><a href=http://192.168.93.239:8080>Portfolio</a></p></body></html>"
msg = MIMEMultipart("alternative")
msg["Subject"] = subject
msg["From"]    = sender
msg["To"]      = receiver
msg.attach(MIMEText(body, "html"))
try:
    ctx = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=ctx) as s:
        s.login(sender, password)
        s.sendmail(sender, receiver, msg.as_string())
    print("Email envoye OK")
except Exception as e:
    print("Erreur:", e, file=sys.stderr)
    sys.exit(1)
