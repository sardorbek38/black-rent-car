import "../globals.css";

export const metadata = { title: "Admin | Black Rent Car", robots: { index: false, follow: false } };

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0..1,0&icon_names=account_balance_wallet,add,airline_seat_recline_normal,arrow_forward,arrow_outward,badge,bolt,calendar_month,calendar_today,call,cancel,check,check_circle,chevron_left,chevron_right,description,directions_car,edit,error,event_available,event_note,gavel,group,home,insights,key,local_gas_station,local_shipping,location_on,logout,map,notifications_active,person,photo_camera,receipt_long,schedule,search,search_off,sell,send,settings,speed,storefront,support_agent,task_alt,timer,today,verified_user,work,workspace_premium&display=block" rel="stylesheet" />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
